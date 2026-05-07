"use client";

type Props = {
  openVideoModal: boolean;
  videoId: string | null;
  title?: string;
  onClose: () => void;
};

export default function WatchVideoModal({
  openVideoModal,
  videoId,
  title,
  onClose,
}: Props) {
  if (!openVideoModal || !videoId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[95%] max-w-3xl rounded-xl bg-zinc-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h2 className="text-white font-semibold text-lg truncate">
            {title || "Watch Video"}
          </h2>

          <button
            onClick={onClose}
            className="text-white text-xl hover:scale-110 duration-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Video */}
        <div className="aspect-video w-full">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title || "video"}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}