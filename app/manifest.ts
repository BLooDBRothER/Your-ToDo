import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Your Todo - Folder Based Todo App",
    short_name: "Your Todo",
    description: "Your Todo is a folder based todo app where user can create folder and related todo inside the respective folder.",
    start_url: '/',
    icons:  [
        {
          src: "/android-icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        }
    ]
  }
}
