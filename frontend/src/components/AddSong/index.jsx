import { useState } from 'react';
import axios from 'axios';

export const AddSong = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);

  const handleTitle = ({ target }) => {
    setTitle(target.value);
  };

  const handleAuthor = ({ target }) => {
    setAuthor(target.value);
  };

  const handleFile = ({ target }) => {
    const file = target.files[0];
    const fileName = file.name.split('.')[0];
    setFile(file);
    setFileName(fileName);
  };

  const uploadSong = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.set('title', title);
    formData.set('author', author);
    formData.set('song_cover', file);

    formData.forEach((value, key) => console.log(key, value));

    axios
      .post('http://localhost:5001/api/v1/create_song', formData)
      .then((e) => console.log(e.data));
  };
  return (
    <form action="" className="flex flex-col gap-5" onSubmit={uploadSong}>
      <input
        type="text"
        placeholder="Enter title of the song"
        className="w-1/3 rounded p-1 pl-2 text-black outline-none"
        onChange={handleTitle}
        required
      />
      <input
        type="text"
        placeholder="Enter author of the song"
        className="w-1/3 rounded p-1 pl-2 text-black outline-none"
        onChange={handleAuthor}
        required
      />
      <div>
        <label htmlFor="submit-img" className="bg-white text-black rounded p-1">
          {fileName || 'Submit song cover'}
        </label>
        <input
          type="file"
          id="submit-img"
          className="bg-red-500 hidden"
          name="song_cover"
          onChange={handleFile}
        />
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className=" bg-white text-black rounded p-1 text-center w-1/2"
        >
          Upload song
        </button>
      </div>
    </form>
  );
};
