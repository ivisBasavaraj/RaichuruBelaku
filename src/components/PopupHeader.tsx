import popupHeaderImage from './image.png';

export default function PopupHeader() {
  return (
    <div className="w-full bg-white border-b border-zinc-200 px-2 py-2">
      <img
        src={popupHeaderImage}
        alt="Satyada Dari Header"
        className="w-full h-auto max-h-24 object-contain"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    </div>
  );
}
