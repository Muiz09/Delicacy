import React, { useState, useEffect, useRef } from "react";
import './home.scss'
import oil from '../assets/olive-oil 3.svg'
import { callAPI } from "../api-url/api-url";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import More from "./More";

export default function Home() {
  const [meals, setMeal] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategory] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Beef");
  const location = useLocation();
  const navigate = useNavigate();
  const hideCategoriesContainer = location.pathname.includes("/favorite");


  const fetchCategories = async () => {
    try {
      const data = await callAPI({
        endpoint: `/categories.php`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const dataFilter = data.categories.slice(0, 6);
      const nameCategory = dataFilter.map((category) => category.strCategory);
      setCategory(nameCategory);

      if (hideCategoriesContainer) {
        setActiveCategory("Favorite");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryClick = (category) => {
    if (location.pathname === "/favorite") {
      navigate("/");
    } else {
      setActiveCategory(category);
      fetchMeals(category)
    }
  };

  const fetchMeals = async (activeCategory) => {
    try {
      const data = await callAPI({
        endpoint: `/filter.php?c=${activeCategory}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const dataFilter = data.meals.slice(0, 5);
      const idMeals = dataFilter.map((meal) => meal.idMeal);
      const mealPromises = idMeals.map((id) => {
        return callAPI({
          endpoint: `/lookup.php?i=${id}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      });
      const mealData = await Promise.all(mealPromises);
      setMeal(mealData);
    } catch (error) {
      console.log(error);
    }
  };

  const cardContainerRef = useRef(null);
  useEffect(() => {
    if (cardContainerRef.current) {
      const onWheel = (e) => {
        e.preventDefault();
        cardContainerRef.current.scrollLeft += e.deltaY;
      };

      cardContainerRef.current.addEventListener("wheel", onWheel);

      return () => {
        if (cardContainerRef.current) {
          cardContainerRef.current.removeEventListener("wheel", onWheel);
        }
      };
    }
  }, []);
  const handleAddToFavorites = (data) => {
    const isAlreadyAdded = favorites.some((favorite) => favorite.idMeal === data.idMeal);

    if (isAlreadyAdded) {
      const updatedFavorites = favorites.filter((favorite) => favorite.idMeal !== data.idMeal);
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = [...favorites, data];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  // ******************
  useEffect(() => {
    fetchMeals("Beef")
    fetchCategories()
  }, []);

  return (
    <div className="container">
      <div className="title-head">
        <h1>Delicacy</h1>
      </div>
      <div className="menus">
        {categories.map((category, index) => (
          <p key={index} className={category === activeCategory ? "active" : ""} onClick={() => handleCategoryClick(category)}>
            {category}
          </p>
        ))}
        <p>Favorite</p>
      </div>
      <div className="container-content-menus">
        {meals.map((el, index) => {
          const data = el.meals[0];
          const isFavorite = favorites.some((favorite) => favorite.idMeal === data.idMeal);
          return (
            <div key={index} className="jarak">
              <div className="content-menus"  >
                <div className="container-left-content">
                  <h1>{data?.strMeal}</h1>
                  <p key={index}>{data?.strInstructions}</p>
                  <h1 className="ing">Ingredients</h1>
                  <div className="ingredient">
                    {/* flex */}
                    <div className="menus-top">
                      <img src={oil} alt="" />
                      <div>
                        <h5>{data.strIngredient1}</h5>
                        <p>{data.strMeasure1}</p>
                      </div>
                    </div>
                    <div className="menus-top">
                      <img src={oil} alt="" />
                      <div>
                        <h5>{data.strIngredient3}</h5>
                        <p>{data.strMeasure3}</p>
                      </div>
                    </div>
                  </div>
                  <div className="ingredient">
                    {/* flex */}
                    <div className="menus-top">
                      <img src={oil} alt="" />
                      <div>
                        <h5>{data.strIngredient4}</h5>
                        <p>{data.strMeasure4}</p>
                      </div>
                    </div>
                    <div className="menus-top">
                      <img src={oil} alt="" />
                      <div>
                        <h5>{data.strIngredient2}</h5>
                        <p>{data.strMeasure2}</p>
                      </div>
                    </div>
                  </div>
                  <div className="btn">
                    <Link to={`/detailRecipies/${data.idMeal}`}>
                      <button>Detail</button>
                    </Link>
                    <button onClick={() => handleAddToFavorites(data)}>{isFavorite ? "Remove Favorite" : "Add To Favorite"}</button>
                  </div>
                </div>
                {/* <div className="logo-menus-top">
                </div> */}
                <div className="container-right-content">
                  <div className="img-menus">
                    <img src={data?.strMealThumb} />
                  </div>
                </div>
              </div>
              {/* <div className="imgContainer">
                <img src={data.strMealThumb} alt="Image" />
              </div> */}
            </div>
          );
        })}
      </div>
      <div style={{display: 'flex'}}>
        <More />
      </div>
    </div>
  )
}