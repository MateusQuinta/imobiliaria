import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '../../lib/supabase'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ImageUploader({ propertyId, onImagesChange, existingImages = [] }) {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState(existingImages)

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true)
    
    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `properties/${propertyId}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath)

        return data.publicUrl
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      const newImages = [...images, ...uploadedUrls]
      setImages(newImages)
      onImagesChange(newImages)
      toast.success('Imagens enviadas com sucesso')
    } catch (error) {
      toast.error('Erro ao enviar imagens')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }, [propertyId, images, onImagesChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 10,
    disabled: uploading
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
            <span className="text-xs text-warm-400">Máximo 10 imagens (JPEG, PNG, WebP)</span>
          </p>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Property image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
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
