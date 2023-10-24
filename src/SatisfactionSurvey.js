import { Button } from "@mui/material";
import React, { useState } from "react";

export default function SatisfactionSurvey({
  maxStars = 5,
  onRating,
  starStyle,
  starHoverStyle,
  onSubmitRating,
}) {
  const [selectedStar, setSelectedStar] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);

  const getStarStyle = (index) => {
    if (index < selectedStar) return starHoverStyle;
    if (index < hoverStar) return starHoverStyle;
    return starStyle;
  };

  const handleRatingSubmission = () => {
    if (onSubmitRating) {
      onSubmitRating(selectedStar);
    }
  };

  return (
    <div>
      {[...Array(maxStars)].map((_, index) => (
        <span
          key={index}
          onClick={() => {
            setSelectedStar(index + 1);
            if (onRating) onRating(index + 1);
          }}
          onMouseOver={() => setHoverStar(index + 1)}
          onMouseOut={() => setHoverStar(0)}
          style={{ ...getStarStyle(index), fontSize: "1.4rem" }}
        >
          ★
        </span>
      ))}
      <br />
      <Button
        className="starBtn"
        style={{
          backgroundColor: "yellow",
          color: "black",
          border: "none",
          padding: "5px 10px",
          cursor: "pointer",
          borderRadius: "20px",
        }}
        onClick={handleRatingSubmission}
      >
        별점 보내기
      </Button>
    </div>
  );
}
