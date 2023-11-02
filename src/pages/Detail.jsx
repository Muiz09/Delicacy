import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { callAPI } from "../api-url/api-url";
import oil from '../assets/olive-oil 3.svg'
import "./detail.scss";
export default function Detail() {
  const { id } = useParams();
  const [recipiesDisplay, setRecipiesDisplay] = useState({});
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
    const fetchRecipies = async () => {
      try {
        const data = await callAPI({
          endpoint: `/lookup.php?i=${id}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setRecipiesDisplay(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecipies();
  }, [id]);

  const recipe = recipiesDisplay.meals && recipiesDisplay.meals[0];

  const ingredients = [];
  const measures = [];

  if (recipe) {
    for (let i = 1; i <= 4; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && measure) {
        ingredients.push(ingredient);
        measures.push(measure);
      }
    }
  }
  const isFavorite = favorites.some((favorite) => favorite.idMeal === id);
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

  return (
    <div className="container-content-menus">
      {/* const data = el.meals[0];
          const isFavorite = favorites.some((favorite) => favorite.idMeal === data.idMeal);
      return ( */}
      <div className="jarak">
        <div className="content-menus"  >
          <div className="container-left-content">
            <h1>{recipe ? recipe.strMeal : ""}</h1>
            <p >{recipe ? recipe?.strInstructions : ""}</p>
            <h1 className="ing">Ingredients</h1>
            <div className="ingredient">
              {/* flex */}
              <div className="menus-top">
                <img src={oil} alt="" />
                <div>
                  <h5>{recipe ? recipe.strIngredient1 : ""}</h5>
                  <p>{recipe ? recipe.strMeasure1 : ""}</p>
                </div>
              </div>
              <div className="menus-top">
                <img src={oil} alt="" />
                <div>
                  <h5>{recipe ? recipe.strIngredient3 : ""}</h5>
                  <p>{recipe ? recipe.strMeasure3 : ""}</p>
                </div>
              </div>
            </div>
            <div className="ingredient">
              <div className="menus-top">
                <img src={oil} alt="" />
                <div>
                  <h5>{recipe ? recipe.strIngredient4 : ""}</h5>
                  <p>{recipe ? recipe.strMeasure4 : ""}</p>
                </div>
              </div>
              <div className="menus-top">
                <img src={oil} alt="" />
                <div>
                  <h5>{recipe ? recipe.strIngredient2 : ""}</h5>
                  <p>{recipe ? recipe.strMeasure2 : ""}</p>
                </div>
              </div>
            </div>
            <div className="btn">
              <button onClick={() => handleAddToFavorites(recipe)}>{isFavorite ? "Remove Favorite" : "Add To Favorite"}</button>
            </div>
          </div>
          <div className="container-right-content">
            <div className="img-menus">
              <img src={recipe ? recipe.strMealThumb : ""} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}