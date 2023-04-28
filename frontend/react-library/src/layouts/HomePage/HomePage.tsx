import {ExploreTopMovies} from "./components/ExploreTopMovies";
import Carousel from "./components/Carousel";
import Heroes from "./components/Heroes";
import FilmvebServices from "./components/FilmvebServices";
import React from "react";

export default function HomePage(){
    return(
      <>
          <ExploreTopMovies/>
          <Carousel/>
          <Heroes/>
          <FilmvebServices/>
      </>
    );
}