const regionImages={
    south:"./Foodimages/pandiya's.jpg",
    delta: "./Foodimages/chola's.jpg",
    north: "./Foodimages/pallava's.jpg",
    west: "./Foodimages/chera's.jpg"

}
const dishes = {
  south: [
    "Madurai: Jigarthanda, Kari Dosai, Idly",
    "Tirunelveli: Iruttu Kadai Halwa, Sodhi Kuzhambu",
    "Thoothukudi: Macaroon, Poricha Parotta",
    "Virudhunagar: Ennai Parotta",
    "Srivilliputhur: Palkova",
    "Dindigul: Thalappakatti Biryani",
    "Palani: Panchamirtham",
    "Sivagangai & Karaikudi: Chettinad Chicken Kuzhambu, Mandi, Kandharappam",
    "Ramanathapuram: King Fish, Karuvadu dishes",
    "Kanyakumari: Nanjil Nattu Fish Curry, Ulundhu Choru",
    "Tenkasi: Courtallam Border Rahmath Parotta"
  ],
  delta: [
    "Thanjavur: Kadappa, Ashoka Halwa",
    "Kumbakonam: Degree Coffee, Kadappa",
    "Trichy: Mor Kuzhambu, Arcot Makkan Paar",
    "Pudukkottai: Muttasand, Boti Curry",
    "Nagapattinam: Seafood varieties",
    "Tiruvarur: Mannargudi Murukku, Traditional Sweets",
    "Mayiladuthurai: Kadai Biryani, Fresh Sea Foods",
    "Ariyalur & Perambalur: Onion Vadai, Millet foods"
  ],
  north: [
    "Chennai: Filter Coffee, Atho, Sundal",
    "Kanchipuram: Kovil Idli",
    "Ambur & Vaniyambadi: Ambur Biryani",
    "Arcot: Makkan Paan",
    "Vellore: Brinjal Sambar",
    "Thiruvallur: Tiffin items, Beach Fish Fry",
    "Chengalpattu: Mahabalipuram Seafood",
    "Villupuram: Gingee Mittai, Thattai",
    "Kallakurichi: Naatu Kozhi dishes",
    "Cuddalore: Seafood, Kathirikai Gotsu",
    "Tiruvannamalai: Ashram Prasadam, Thattai"
  ],
  west: [
    "Coimbatore: Pallipalayam Chicken, Kaalan Fry, Annapoorna Sambar",
    "Salem: Thattu Vadai Set, Mango varieties",
    "Erode: Pallipalayam Chicken Gravy, Halwa",
    "Tiruppur: Kongu Biryani, Ghee snacks",
    "Namakkal: Egg Rice, Layer Egg dishes",
    "Ooty: Varkey, Chocolates",
    "Karur: Seedai, Murukku",
    "Dharmapuri & Krishnagiri: Ragi Kali, Kollu Thuvaiyal, Mango sweets",
    "Theni: Kumbakarai snacks, Milk sweets"
  ]
};

function showRegion(region) {
  const list = document.getElementById("dishList");
  list.innerHTML = "";
  dishes[region].forEach(item => {
    const card=document.createElement("div");
    card.className =
            "p-4 border rounded shadow bg-white hover:scale-105 transition-transform";
            card.textContent=item;
            list.appendChild(card)
  });
}
