import React, { useState, useEffect } from "react";
import { callAPI } from "../api-url/api-url";
import { Link } from "react-router-dom";
import './more.scss'

export default function More() {
  const [meals, setMeal] = useState([]);
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const data = await callAPI({
          endpoint: `/filter.php?c=Vegetarian`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const filter = data.meals
        const idMeals = filter.map((meal) => meal.idMeal);
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
    fetchMeals();
  }, []);
  return (
    <div className="more">
      <div className="title-head">
        <h1>More recipies</h1>
      </div>
      <div className="card-container">
        {meals.map((meal) => {
          const data = meal.meals[0];
          return (
            <Link className="link" to={`/detailRecipies/${data.idMeal}`} key={data.idMeal}>
              <div className="card">
                <div className="img-card">
                  <img src={data.strMealThumb} alt="" />
                </div>
                <div className="title-card">
                  <h1>{data.strMeal}</h1>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
