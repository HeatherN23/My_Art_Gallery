//REQUEST FOR RECORDS BY ID
//GET /public/collection/v1/objects/[objectID] returns a record for an object
// Request: https://collectionapi.metmuseum.org/public/collection/v1/objects/[objectID]

// QUERY REQUEST
//GET /public/collection/v1/search   returns a listing of all Object IDs for objects that contain the search query within the object’s data
//https://collectionapi.metmuseum.org/public/collection/v1/search?q=sunflowers

// MEDIUM REQUEST
//https://collectionapi.metmuseum.org/public/collection/v1/search?medium=Quilts|Silk|Bedcovers&q=quilt

//ARTIST OR CULTURE REQUEST
//https://collectionapi.metmuseum.org/public/collection/v1/search?artistOrCulture=true&q=french

//DATE RANGE REQUEST
//https://collectionapi.metmuseum.org/public/collection/v1/search?dateBegin=1700&dateEnd=1800&q=African

//let axios = "https://unpkg.com/axios/dist/axios.min.js"


const gallery = document.querySelector(".gallery");
const artistDD = document.querySelector("#artDD");
const artImg = document.querySelector(".artImg");
const artist = document.querySelector(".artist");
const artTitle = document.querySelector(".artTitle");
const artDate = document.querySelector(".artDate");
const artDesc = document.querySelector(".artDesc");
const error = document.querySelector(".error");

// listen for events
artistDD.addEventListener("change", (e) => {
  e.preventDefault(); // PREVENT THE FORM FROM REFRESHING   

  //If the user selects a dropdown item, erase the existing artwork and get the enw Data
  if (artistDD.value !== "error") {
    error.style.display = "none";
    gallery.innerHTML="";
    error.innerHTML = "";  
    getArtData(artistDD.value);
  } else {
    // Show error message to user
    error.innerHTML = `<h4>No Selection Made. Please select an artist.</h4>`;  
    error.style.display = "block";   
    gallery.innerHTML=
    `  <div class="artRow">                                         
          <div class="imageContainer">                                 
            <img class="artImg" src="/images/generic_cubist_img.png" width="300"/>    
          </div>                        
          <div class="artData">
            <h3 class="artist">Artist: Artist Name</h4>
            <h4 class="artTitle">Title: Artwork</h3>            
            <p class="artDate">Date: 12/12/1912</p>            
            <p class="artDesc">More Details: <span class="error">Please select an artist to populate this area.</span></p>
          </div>
        </div>             
        `;  
  }            
   
});

function getArtDetails(response) {
  let html = `  
    <div class="artRow">
      <div>                                
        <img class="artImg" src="${response.primaryImageSmall}" width="300"/>
      </div>                        
      <div class="artData">
        <h3 class="artist">Artist: ${response.artistDisplayName}</h4>
        <h4 class="artTitle">Title: ${response.title}</h3>            
        <p class="artDate">Date: ${response.objectDate}</p>            
        <p class="artDesc">More Details: <a href="${response.objectURL}" target="_blank">${response.objectURL}</a></p>
      </div>
    </div>
  `;

  let newDiv = document.querySelector(".gallery");
  newDiv.insertAdjacentHTML("beforeend", html);  
}

async function getArtData(search) {
  // Fetch the artist ID
  let response = await fetch(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${search}`
  )
    .then((response) => {
      return response.json();
    })
    .then((response) => {      
      // loop thru the response object Id's and use the ID's to get the art work Objects
      
      for (let i = 0; i < response.objectIDs.length  && i <=8; i++) {       
        //Fetch the artwork by the artist.        
        let fetchURL = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${response.objectIDs[i]}`;
        fetch(fetchURL) // get the artwork object
          .then((response) => {
            return response.json(); // convert the object to json
          })
          .then((response) => {
            
            //If the object contains a small painting & is not blank or undefined build the HTML   
            if( response.artistDisplayName.includes(search)  )   {
              if ( typeof(response.primaryImageSmall) !== 'undefined') { 
                if( response.primaryImageSmall !== "" ) {
                getArtDetails(response);
                }
              }   
            }         
          })
          .catch((error) => {
            error.innerHTML= `${error}`;   
        });          
      }
    });  
}





