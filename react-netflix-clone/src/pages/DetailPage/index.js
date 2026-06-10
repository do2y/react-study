import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";

export default function DetailPage() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState({});

  console.log("movieId", movieId);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(`/movie/${movieId}`);
      setMovie(request.data);
    }
    fetchData();
  }, [movieId]); //movieId가 변할 때마다 호출

  if (!movie) return <div>...loading</div>;

  return (
    <div>
      <section>
        <img
          className="modal__poster-img"
          src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
          alt="poster"
        />
      </section>
    </div>
  );
}
