"use client"

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {

  const [inputFormat, setInputFormat] = useState('')
  const [outputFormat, setOutputFormat] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleConvert = async () => {
    if (!file || !inputFormat || !outputFormat) {
      toast.error("Preencha todos os campos!")
      return
    }

    setIsUploading(true)
    setProgress(10)

    const formData = new FormData()
    formData.append("file", file)

    try {
       const endpoint = `http://localhost:3001/upload/${inputFormat}`

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Falha na conversão")
      }

      const data = await res.json()
      setProgress(100)
      toast.success("Arquivo convertido com sucesso!")

      // download
      setTimeout(() => {
        window.open(data.downloadUrl, '_blank');
      }, 1000);
    } catch (error) {
      toast.error("Erro na conversão do arquivo")
    } finally {
      setIsUploading(false)
      setProgress(0)
    }

  }


  return (
    <div className="max-w-xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        Conversor de arquivos
      </h1>
      <p className="text-muted-foreground text-center">
        Converta arquivos entre formatos como DOCX, XLSX, PDF e imagens com segurança e privacidade.
      </p>

      <div className="space-y-4">
        <Select onValueChange={setInputFormat}>
          <SelectTrigger>
            <SelectValue placeholder="Formato de Entrada" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="docx">DOCX</SelectItem>
            <SelectItem value="xlsx">XLSX</SelectItem>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="jpg">JPG</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
          </SelectContent>

        </Select>

        <div>
          <ArrowRightCircle className="size-6" />
        </div>

        <Select onValueChange={setOutputFormat}>
          <SelectTrigger>
            <SelectValue placeholder="Formato de saída" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="docx">DOCX</SelectItem>
            <SelectItem value="jpg">JPG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <input type="file" accept="*" onChange={handleFileChange} className="block w-full text-sm" />

      <Button onClick={handleConvert} disabled={isUploading || !file}>
        {isUploading ? 'Convertendo...' : 'Converter'}
      </Button>

      {isUploading && <Progress value={progress}/>}

    </div>
  );
}
