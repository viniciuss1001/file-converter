import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { exec } from 'child_process';
import { join } from 'path';
import { promisify } from 'util';
import * as fs from 'fs';

const execPromise = promisify(exec);

@Injectable()
export class UploadService {
  // dock -> pdf
  async convertDocxToPdf(filePath: string): Promise<{ downloadUrl: string }> {
    try {
      const outputDir = join(process.cwd(), 'converted');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      const absoluteFilePath = join(process.cwd(), filePath);
      console.log('Caminho absoluto do arquivo:', absoluteFilePath);

      const command = `libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${absoluteFilePath}"`;

      // Executa o comando e captura stdout e stderr
      const { stdout, stderr } = await execPromise(command);

      console.log('LibreOffice stdout:', stdout);
      console.error('LibreOffice stderr:', stderr);

      const originalFileName = filePath.split('/').pop();
      const baseName = originalFileName?.replace(/\.[^/.]+$/, '');
      const convertPath = join(outputDir, `${baseName}.pdf`);

      if (!fs.existsSync(convertPath)) {
        throw new InternalServerErrorException('Conversão falhou.');
      }

      return { downloadUrl: `/converted/${baseName}.pdf` };
    } catch (error) {
      console.error('erro na conversão', error);
      throw new InternalServerErrorException(
        `Erro ao converter arquivo: ${error.message || error}`,
      );
    }
  }
  // xlsx -> pdf
  async convertXlsxToPdf(filePath: string): Promise<{ downloadUrl: string }> {
    try {
      const outputDir = join(process.cwd(), 'converted');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      const command = `libreoffice --headless --convert-to pdf --outdir ${outputDir} ${filePath}`;

      await execPromise(command);

      const originalFileName = filePath.split('/').pop();
      const baseName = originalFileName?.replace(/\.[^/.]+$/, '');
      const convertedPath = join(outputDir, `${baseName}.pdf`);

      if (!fs.existsSync(convertedPath)) {
        throw new InternalServerErrorException('Conversão de XLSX falhou');
      }

      return { downloadUrl: `/converted/${baseName}.pdf` };
    } catch (error) {
      console.log('erro na conversão', error);
      throw new InternalServerErrorException(
        `Erro ao converter XLSX: ${error}`,
      );
    }
  }
}
