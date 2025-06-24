import { defineConfig} from 'vite'
// eslint-disable-next-line no-unused-vars
// import dotenv from 'dotenv'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // define: {
  //   // eslint-disable-next-line no-undef
  //   'process.env.VITE_FT_DB_URI': JSON.stringify(process.env.VITE_FT_DB_URI)
  // }
  
})


// import { defineConfig, loadEnv } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// export default defineConfig(({mode}) => {
//   // Load env file based on `mode` in the current working directory.
//   // Set the third parameter to '' to load all env regardless of the
//   // `VITE_` prefix.
//   const env = loadEnv(mode, process.cwd(), '')
//   return {
//     // vite config
//     plugins: [react()],
//     define: {
//       'process.env.VITE_DB_URI': JSON.stringify(process.env.VITE_DB_URI)
//     },
//   }
// })
