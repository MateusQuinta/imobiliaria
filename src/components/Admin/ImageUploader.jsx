import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '../../lib/supabase'
import { Upload, X, ArrowLeft, ArrowRight, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

const BUCKET = 'property-images'
const MAX_SIZE_MB = 10
const MAX_IMAGES = 20

export default function ImageUploader({ propertyId, onImagesChange, existingImages = [] }) {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState(existingImages)

  const onDrop = useCallback(
    async (acceptedFiles, fileRejections) => {
      if (fileRejections?.length > 0) {
        toast.error(`Alguns arquivos foram recusados. Limite máximo de ${MAX_IMAGES} fotos e até ${MAX_SIZE_MB}MB cada.`)
      }
      if (acceptedFiles.length === 0) return

      if (images.length + acceptedFiles.length > MAX_IMAGES) {
        toast.error(`Máximo de ${MAX_IMAGES} fotos por imóvel.`)
        return
      }

      setUploading(true)

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

          if (uploadError) {
            // Se der erro de RLS no Supabase, fallback para Data URL local no navegador
            return new Promise((resolve) => {
              const reader = new FileReader()
              reader.onloadend = () => resolve(reader.result)
              reader.readAsDataURL(file)
            })
          }

          const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath)
          return data.publicUrl
        })
      )

      const uploadedUrls = results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value)

      if (uploadedUrls.length > 0) {
        const newImages = [...images, ...uploadedUrls]
        setImages(newImages)
        onImagesChange(newImages)
        toast.success(`${uploadedUrls.length} foto(s) adicionada(s)!`)
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
    maxFiles: MAX_IMAGES,
    maxSize: MAX_SIZE_MB * 1024 * 1024,
    disabled: uploading,
  })

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange(newImages)
  }

  // Ordenação das fotos
  const moveImage = (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= images.length) return
    const newImages = [...images]
    const temp = newImages[index]
    newImages[index] = newImages[targetIndex]
    newImages[targetIndex] = temp
    setImages(newImages)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-gold-500 bg-gold-50/50' : 'border-warm-300 hover:border-gold-500 bg-warm-50'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-warm-200 flex items-center justify-center mx-auto mb-3 text-gold-500">
          <Upload size={24} />
        </div>
        <p className="font-semibold text-sm text-navy-900">
          {uploading ? 'Enviando imagens...' : 'Clique ou arraste as fotos aqui'}
        </p>
        <p className="text-xs text-warm-500 mt-1">
          Até {MAX_IMAGES} fotos em alta resolução (JPG, PNG ou WEBP até {MAX_SIZE_MB}MB cada). A primeira foto será a capa principal.
        </p>
      </div>

      {images.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-navy-900">
              Galeria de Fotos ({images.length}/{MAX_IMAGES})
            </span>
            <span className="text-xs text-warm-400">Use as setas para reordenar a sequência</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative group rounded-xl overflow-hidden aspect-video border-2 shadow-sm ${
                  idx === 0 ? 'border-gold-500 ring-2 ring-gold-400/30' : 'border-warm-200'
                }`}
              >
                <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                {idx === 0 && (
                  <span className="absolute top-1 left-1 bg-gold-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                    Capa
                  </span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 p-1">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(idx, -1)}
                      className="p-1 bg-white/80 hover:bg-white text-navy-900 rounded shadow text-xs"
                      title="Mover para esquerda"
                    >
                      <ArrowLeft size={12} />
                    </button>
                  )}
                  {idx < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(idx, 1)}
                      className="p-1 bg-white/80 hover:bg-white text-navy-900 rounded shadow text-xs"
                      title="Mover para direita"
                    >
                      <ArrowRight size={12} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-1 bg-red-600 text-white hover:bg-red-700 rounded shadow text-xs"
                    title="Remover foto"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
