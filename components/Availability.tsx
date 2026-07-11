"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


type Booking = {
  id: number;
  court_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
};


type Court = {
  id: number;
  name: string;
  color: string;
};


const times = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];



function getToday(){

  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth()+1).padStart(2,"0");

  const day = String(now.getDate()).padStart(2,"0");


  return `${year}-${month}-${day}`;

}



export default function Availability(){


const [courts,setCourts] = useState<Court[]>([]);

const [bookings,setBookings] = useState<Booking[]>([]);

const [today,setToday] = useState(getToday());



async function loadData(){


const {data:courtsData,error:courtError}=await supabase
.from("courts")
.select("*")
.order("id");



const {data:bookingData,error:bookingError}=await supabase
.from("bookings")
.select("*")
.eq("booking_date",today);



console.log("COURTS",courtsData);

console.log("BOOKINGS",bookingData);



if(courtsData){

setCourts(courtsData);

}



if(bookingData){

setBookings(bookingData);

}



}



useEffect(()=>{


loadData();



const channel = supabase
.channel("booking-update")

.on(
"postgres_changes",
{
event:"*",
schema:"public",
table:"bookings",
},
()=>{

loadData();

}

)

.subscribe();



const timer = setInterval(()=>{

setToday(getToday());

},60000);



return()=>{

supabase.removeChannel(channel);

clearInterval(timer);

};



},[today]);





function checkBooked(
courtId:number,
time:string
){


return bookings.some((booking)=>{


if(booking.court_id !== courtId)
return false;



const start =
booking.start_time.substring(0,5);



const end =
booking.end_time.substring(0,5);



return time >= start && time < end;



});


}





return(


<section className="bg-slate-950 py-20 px-8 text-white">


<h2 className="text-4xl font-bold text-center mb-3">

Today's Court Availability

</h2>



<p className="text-center text-gray-400 mb-12">

{new Date().toLocaleDateString("id-ID",{

weekday:"long",

day:"numeric",

month:"long",

year:"numeric"

})}

</p>




<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">



{courts.map((court)=>(



<div

key={court.id}

className="bg-slate-900 rounded-2xl p-6 border border-slate-800"

>


<h3 className="text-xl font-bold mb-6">

{court.name}

</h3>



{times.map((time)=>{


const booked =
checkBooked(court.id,time);



const nextHour =
String(
Number(time.substring(0,2))+1
)
.padStart(2,"0");



return(


<div

key={time}

className="flex justify-between items-center py-3 border-b border-slate-800"

>


<span>

{time.replace(":",".")} - {nextHour}.00

</span>



<span

className={

booked

?

"text-red-400 font-bold"

:

"text-green-400 font-bold"

}

>

{booked ? "Booked":"Available"}


</span>



</div>


);


})}



</div>



))}



</div>



</section>



);



}