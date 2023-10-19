import React, { useState } from 'react'

export default function SatisfactionSurvey({onSubmit}) {
    // 만족도 조사 컴포넌트

    const [rating, setRating] = useState(0); // 사용자가 선택한 만족도

    const [handleRatingChange] = (value) => {
        setRating(value);
    }

    const handleSubmit = () => {
        onSubmit(rating);
    };
    
    return (
    <div>
      <h3>만족도 조사</h3>
      {[1, 2, 3, 4, 5].map((value) => (
        <button key={value} onClick={() => handleRatingChange(value)}>
            {value}점
        </button>
      ))}
      <button onClick={handleSubmit}>제출</button>
    </div>
  );
}
