import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { AddSong } from '../../components/AddSong';
import './Home.css';
import { Footer } from '../../components/footer';
import { Song } from '../../components/Song';
import axios from 'axios';
export const Home = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/v1/songs').then((response) => {
      console.log(response.data);
      setData(response.data);
    });
  }, []);

  return (
    <div className="min-h-screen text-gray-300">
      <Header setShowSidebar={setShowSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="bg-custom-section pt-28 md:pl-72 p-8 ">
        <div className="flex flex-col gap-10 mt-10 p-3 ">
          <AddSong />
          <div className="flex flex-wrap flex-row gap-10 items-center justify-center">
            {data.map((song) => (
              <Song
                title={song.title}
                author={song.author}
                imgLink={song.song_cover_url}
                key={song._id}
              />
            ))}
            {/* <Song />
            <Song />
            <Song />
            <Song />
            <Song />
            <Song /> */}
          </div>
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
};
