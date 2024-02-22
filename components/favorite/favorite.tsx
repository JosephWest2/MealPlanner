"use client";

import styles from "./favorite.module.css";
import Image from "next/image";
import heart from "./heart.png";
import greyHeart from "./heartGrey.png";
import { useState } from "react";
import changeFavorite from "@/app/actions/changeFavorite";

export default function Favorite({recipeId, isFavorited} : {recipeId: number, isFavorited: boolean}) {

    const [favorited, setFavorited] = useState(isFavorited);

    function OnChange() {
        const newFavorte = !favorited;
        changeFavorite(recipeId, newFavorte);
        setFavorited(newFavorte);
    }

    return (
        <button data-favorited={favorited} className={styles.favoriteButton} onClick={OnChange}>
            <Image src={favorited ? heart : greyHeart} alt="heart"></Image>
        </button>
    )
}