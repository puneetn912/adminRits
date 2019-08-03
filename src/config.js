let apiurl;
if(process.env.NODE_ENV==="development"){
	apiurl = 'http://localhost:3001/'
} else {
  	apiurl = 'http://captain.ritsworld.com/'
}

export const apiUrl = apiurl