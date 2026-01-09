"use client"
import { useApi } from "@/context/ApiContext";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {

  const {api} = useApi()

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${api}` , {method: "GET"});
      const data = await res.json();
      console.log(data);
    };

    fetchData();
  }, [])

  return (
    <div>hello</div>
  );
}
 