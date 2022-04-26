let addToy = false;

document.addEventListener("DOMContentLoaded", ()=> {formFunctionality(); handleToyCards()} )

//create and append the form to add new toys
function formFunctionality() {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", (event) => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  })
  //take name and url and return a formatted card object
  const handleToySub = ()=>{
    let name = document.querySelector(`[name='name']`).value
    let image = document.querySelector(`[name='image']`).value

    let nextId = (id)=>id+1;
    let toyElement = {}
    //fetch existing array and make toyElement Id array.length plus 1
    fetch('http://localhost:3000/toys').then(res=>res.json()).then(data => toyElement['id'] = data.length + 1 );
      //continues making the card 
      toyElement['name'] = name;
      toyElement['image']=image;
      toyElement['likes']=0
      
      console.log(toyElement)
      //clear the input
      document.querySelector(`[name='name']`).value = ''
      document.querySelector(`[name='image']`).value = ''
      
      //next is to push toyElement to json
      //then run makecard(toyElement) >> that could be a problem as makecard is hidden within handleToyCard...which is bad anyway. Let's unpack all these functions.
      
      return toyElement
  }
  //get the toy form, supress default and pass handleToySub
  const toyForm = document.querySelector('form.add-toy-form')
  toyForm.addEventListener('submit',(event)=>{event.preventDefault();handleToySub() })
 


}



//fetch and display toy cards
function handleToyCards(){

//code to actually make the card
  const makeCard = (element)=>{
    // create the parent card
    const card = document.createElement('div')
    card.className = 'card'
    card.id = `number${element['id']}`
    //create header with name
    const h2 = document.createElement('h2')
    h2.textContent = element['name']
    card.appendChild(h2)
    //create image tag
    const image = document.createElement('img')
    image.src = element['image']
    image.className = 'toy-avatar'
    card.appendChild(image)
    
    //add like count
    let likeCountNum = parseInt(element['likes'],10)
    const likeCount = document.createElement('p')
    likeCount.textContent = `${likeCountNum} likes`
    card.appendChild(likeCount)

    //create the like button
    const likeButton = document.createElement('button')
    likeButton.className = "like-btn"
    likeButton.id = "[toy_id]"
    likeButton.textContent = 'Like ❤️'
    //add the event listener
    likeButton.addEventListener('click', (
      ()=>{
        handleLike( element['id'], (likeCountNum + 1) ); 
        //here we increment the like count as that is what we are feeding into handle like
        likeCountNum ++;
          }
          )
          )
    card.appendChild(likeButton)
    

    //append card to the page
    document.querySelector('#toy-collection').appendChild(card)

  }
  
  //separate function to handle the patch request
  //.then(data => 'here I also updated the cards like text content)
  const handleLike = (id,newLikeCount)=>{
    

     fetch(`http://localhost:3000/toys/${id}`,{
      method: 'PATCH',
      body: JSON.stringify({
        'likes': newLikeCount,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
    }).then(res=>res.json()).then( data=> { let x = document.querySelector(`#number${id} p`) ; console.log(x); x.textContent = `${data['likes']} likes` }) 
     


  
  }


//fetch the data and run makeCard() on it
  fetch('http://localhost:3000/toys').then(res=>res.json()).then(data => {for (i in data) {makeCard(data[i])}})


}