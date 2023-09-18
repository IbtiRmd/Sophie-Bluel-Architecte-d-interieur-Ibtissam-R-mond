

// recuperer le formulaire
const formlogin = document.getElementById('formLogin');

formlogin.addEventListener("submit" , login);

function login(event)
{
    event.preventDefault();

    const elementEmail = document.getElementById("email");

    const passWord = document.getElementById("password");
    

    fetch("http://localhost:5678/api/users/login",
    {
        method: "POST",
        headers:
        {
            "Content-type": "application/json"
        },
        body:
        
            JSON.stringify (
                {
                    'email' : "sophie.bluel@test.tld", //elementEmail.value,
                    'password': "S0phie"//passWord.value 
                }
            ) 
    }).then(function(response){

        

        if (!response.ok) {
            throw new Error("Erreur d’identifiant ou de mot de passe");
          }
          return response.json();


    }).then(function(login){


        if (login.token) 
            {
                // Stockage du tok
            localStorage.setItem('token',login.token);
            window.location.href = "./index.html";
            }

        else
            {  
                    throw new Error("Erreur lors de la connexion");   
            }
     })
}
