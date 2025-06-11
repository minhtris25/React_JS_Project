import React from 'react';
import Hero from '../components/Hero'
import FeaturedDestination from '../components/FeaturedDestination';
import ExclusiveOffers from '../components/ExclusiveOffers';
import Testimonial from '../components/Testimonial';
import NewLetter from '../components/NewsLetter';
import RecommendedHotels from '../components/RecommendedHotels';

const Home = () => {
  return (
    <>
        <Hero />
        <RecommendedHotels />
        <FeaturedDestination />
        <ExclusiveOffers />
        <Testimonial />
        <NewLetter />
    </>
  );
};

export default Home;
