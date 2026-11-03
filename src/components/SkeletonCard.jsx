/**
 * SkeletonCard — Loading placeholder animado para cards de imóveis
 * Props:
 *   count: número de cards a exibir (default: 3)
 */
export default function SkeletonCard({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-warm-200 flex flex-col animate-pulse"
        >
          {/* Imagem skeleton */}
          <div className="h-56 bg-warm-200" />

          {/* Conteúdo skeleton */}
          <div className="p-6 space-y-3 flex-1">
            {/* Badge localização */}
            <div className="h-3 w-2/5 bg-warm-200 rounded-full" />

            {/* Título */}
            <div className="space-y-2">
              <div className="h-5 w-full bg-warm-200 rounded-lg" />
              <div className="h-5 w-3/4 bg-warm-200 rounded-lg" />
            </div>

            {/* Preço */}
            <div className="h-7 w-1/2 bg-warm-200 rounded-lg mt-1" />

            {/* Atributos */}
            <div className="flex gap-4 pt-3 border-t border-warm-100">
              <div className="h-3 w-12 bg-warm-200 rounded-full" />
              <div className="h-3 w-12 bg-warm-200 rounded-full" />
              <div className="h-3 w-14 bg-warm-200 rounded-full" />
              <div className="h-3 w-14 bg-warm-200 rounded-full" />
            </div>
          </div>

          {/* Botão skeleton */}
          <div className="px-6 pb-6">
            <div className="h-10 w-full bg-warm-200 rounded-xl" />
          </div>
        </div>
      ))}
    </>
  )
}
