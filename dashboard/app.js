// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {getFirestore,  setDoc, getDocs, doc, getDoc, addDoc, collection  } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCt_OImtFReluoLA6tuGWz5_O8go3Fovoo",
  authDomain: "mini-hachton.firebaseapp.com",
  projectId: "mini-hachton",
  storageBucket: "mini-hachton.appspot.com",
  messagingSenderId: "510208638784",
  appId: "1:510208638784:web:037a0d4425471d496004a5",
  measurementId: "G-PE4LN8033Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



const Username = document.querySelector(".username")
// console.log(Username);
const publish = document.querySelector("#publishBtn")
// console.log(publish);
const PostTitle = document.querySelector("#blogTitle")
// console.log(PostTitle);
const PostContent = document.querySelector("#blogBody")
// console.log(PostContent);
const blogProfileDetail = document.querySelector(".blogProfileDetail")
// console.log(blogProfileDetail);
const ss = document.querySelector("#ss")
// console.log(ss);
const ff = document.querySelector("#ff")
// console.log(ff);
const blog = document.querySelector(".blog")

const bigprofile = document.querySelector(".blogProfile")
// console.log(bigprofile);


let loggedInuserID ;

onAuthStateChanged(auth,async (user) => {
    if (user) {     
        // console.log(user)
      const uid = user.uid;
    //   console.log(uid);
    loggedInuserID = uid;
    // console.log(loggedInuserID)

    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
    //   console.log("Document data:", docSnap.data());
    const {firstname , lastname } = docSnap.data()
    Username.innerHTML = `${firstname} ${lastname}`

    } else {
      // docSnap.data() will be undefined in this case
    //   console.log("No such document!");
  

    }

    } else {
      // User is signed out
     window.location.href = '../signup.html'
    }
  });







const logoutBtn = document.querySelector('#logoutBtn')
//   console.log(logoutBtn);


logoutBtn.addEventListener('click',  logouthandler)

function logouthandler () {
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
}







publish.addEventListener('click',PublishbtnHanlder)

async function PublishbtnHanlder(){
    // console.log(PublishbtnHanlder);
    try {
        const response = await addDoc(collection(db, "posts"), {
        PostTitle: PostTitle.value,
        PostContent: PostContent.value,
        authorId: loggedInuserID,
    //    timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
// console.log(response.id)
        getpost()
        PostTitle.value = ''
        PostContent.value = ''
     } catch (error) {
     console.error(error);
    }
}

async function getpost(){

    blogProfileDetail.innerHTML = ' '
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach(async (doc) => {
    
        const { authorId, PostTitle,PostContent ,timestamp} = doc.data()
        
        const authorDetails = await getAuthorData(authorId)
        let postId = doc.id
        const PosTelement = document.createElement('div')
        PosTelement.setAttribute('class', 'mypost')

        const content = `
        <div class="singleBlog">
        <div class="blogProfile">
          <img src="../Assets/dummy.jpeg" alt="" />
          <div class="blogProfileDetail">
            <h4 id="ss">${ss}</h4>
            <p id="ff">${ff} - Date</p>
          </div>
        </div>
         <div class="blog">
          ${blog}
        </div> 
         <div class="seeAll">
          <button class="editBtn">edit</button>
          <button class="deleteBtn">Delete</button>
        </div>
        `
        PosTelement.innerHTML = content
        blogProfileDetail.appendChild(PosTelement)
    // alert('your post has been added')           
})
}




async function getAuthorData(authorId){
    const docRef = doc(db, "users", authorId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        return docSnap.data()
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}

async function DeletePostHandler(postId){
    // console.log(DeletePostHandler);
    await deleteDoc(doc(db, "posts", postId));
    alert("Your post deleted successfully")
    getpost()
}

async function editPostHandler(postId){
    // console.log(editPostHandler);
    modal.classList.remove('hidden')
    updateHanlderFuction()
    postGlobal = postId
}
async function updateHanlderFuction(){
    try {
        const washingtonRef = doc(db, "posts", postGlobal);
        const response = await updateDoc(washingtonRef, {
            UpdateTitle : postTitle.value,
            UpdateDescription : PostDescription.value,
            authorId: currentLoggedInUser

        });
        getpost()
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}




window.editPostHandler = editPostHandler
window.DeletePostHandler = DeletePostHandler