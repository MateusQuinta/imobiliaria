import { useState } from 'react'

export default function LazyImage({ src, alt, className = '', imgClassName = '', style = {}, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-warm-200 animate-pulse z-10" />
      )}
      {hasError ? (
        <div className="absolute inset-0 bg-warm-100 flex items-center justify-center p-4 text-center">
          <span className="text-warm-400 text-xs">Imagem não disponível</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt || 'Imóvel Viva Belle'}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          style={style}
          {...props}
        />
      )}
    </div>
  )
}
