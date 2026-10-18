import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '../../lib/supabase'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

const BUCKET = 'property-images'
const MAX_SIZE_MB = 5

export default function ImageUploader({ propertyId, onImagesChange, existingImages = [] }) {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState(existingImages)

  const onDrop = useCallback(
    async (acceptedFiles, fileRejections) => {
      if (fileRejections?.length > 0) {
        toast.error('Alguns arquivos foram recusados (tipo inválido, tamanho ou limite de 10 imagens)')
      }
      if (acceptedFiles.length === 0) return

      if (images.length + acceptedFiles.length > 10) {
        toast.error('Máximo de 10 imagens por imóvel')
        return
      }

      setUploading(true)

      // Imóvel novo ainda não tem ID: usa uma pasta temporária única
      const folder = propertyId || `new-${crypto.randomUUID()}`

      const results = await Promise.allSettled(
        acceptedFiles.map(async (file) => {
          const fileExt = (file.name.split('.').pop() || 'jpg').toLowerCase()
          const filePath = `properties/${folder}/${crypto.randomUUID()}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(filePath, file, {
              contentType: file.type,
              cacheControl: '3600',
              upsert: false,
            })

          if (uploadError) throw uploadError

          const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath)
          return data.publicUrl
        })
      )

      const uploadedUrls = results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value)

      const failed = results.filter((r) => r.status === 'rejected')
      failed.forEach((r) => console.error('Erro no upload:', r.reason))

      if (uploadedUrls.length > 0) {
        const newImages = [...images, ...uploadedUrls]
        setImages(newImages)
        onImagesChange(newImages)
        toast.success(`${uploadedUrls.length} imagem(ns) enviada(s)`)
      }

      if (failed.length > 0) {
        const msg = failed[0].reason?.message || 'Erro desconhecido'
        toast.error(`Falha em ${failed.length} imagem(ns): ${msg}`)
      }

      setUploading(false)
    },
    [propertyId, images, onImagesChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 10,
    maxSize: MAX_SIZE_MB * 1024 * 1024,
    disabled: uploading,
  })

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-gold-500 bg-gold-50' : 'border-warm-300 hover:border-gold-500'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload size={32} className="mx-auto text-warm-400 mb-2" />
        {uploading ? (
          <p className="text-warm-500">Enviando imagens...</p>
        ) : (
          <p className="text-warm-500">
            Arraste imagens aqui ou clique para selecionar
            <br />
            <span className="text-xs text-warm-400">
              Máximo 10 imagens, até {MAX_SIZE_MB} MB cada (JPEG, PNG, WebP)
            </span>
          </p>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt={`Imagem do imóvel ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="flex items-center justify-center text-warm-400 py-8">
          <ImageIcon size={24} className="mr-2" />
          <span>Nenhuma imagem enviada</span>
        </div>
      )}
    </div>
  )
}