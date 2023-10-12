import React from 'react'
import AuthContext from './AuthContext';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ImageQuestion() {


    // const {setLoggedIn} = useContext(AuthContext); // 전역 상태관리
    const [imagePreview, setImagePreview] = useState(null);  // 이미지 미리보기 상태

    const diagnosis = "00병"

    // const TestLoggedIn = () => {
    //     setLoggedIn(prevLoggedIn => !prevLoggedIn);
    // }

    // 파일 업로드 핸들러
    const handleFileUpload = (e) => {
        const file = e.target.files[0];

        // 이미지 미리보기 설정
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }

        console.log(file);
    }
    
    const onDragOver = (e) => {
        e.preventDefault();
    }
    
    const onDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload({ target: {files} });
        }
    }

    return (
        <div>이미지로 물어보기</div>
    );
}
