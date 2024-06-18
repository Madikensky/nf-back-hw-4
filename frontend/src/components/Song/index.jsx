export const Song = ({ imgLink, title, author }) => {
  return (
    <div className="flex flex-col border-4 w-1/4 rounded-2xl border-green-600 ">
      <img
        alt=""
        src={
          imgLink ||
          'https://cdn.pixabay.com/photo/2016/10/22/00/15/spotify-1759471_1280.jpg'
        }
        className="rounded-t-xl"
      />
      <div className="flex flex-col  bg-black text-center text-green-600 rounded-b-xl p-2">
        <div className="border-b-2">{title || 'title'}</div>
        <div className="">{author || 'author'}</div>
      </div>
    </div>
  );
};
