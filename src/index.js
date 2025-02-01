/** --------------------- 🏗️ INITIAL SETUP --------------------- **/

const init = () => {

  /** --------------------- STATEFUL VARS--------------------- **/
  let isLoading = true
  let inEditMode = false
  let colors = []
  let formData = { title: '', code: '' }
  let selectedColor = { id: '', title: '', code: '' }

  /** --------------------- INIT FETCH --------------------- **/
  fetchColors()
  /** ---------------------EVENT HANDLERS  --------------------- **/

  /** --------------------- 🎨 RENDER FUNCTIONS --------------------- **/


  /** --------------------- 🎯 HANDLER FUNCTIONS --------------------- **/


  /** --------------------- 🛠️ UTILITY FUNCTIONS --------------------- **/


  /** --------------------- 📡 API CALLS --------------------- **/
  async function fetchColors() {
    try {
      const r = await fetch(`http://localhost:3000/colors`)
      if (!r.ok) {
        throw new Error('Bad GET response')
      }
      const data = await r.json()
      console.log(data)
    } catch (error) { console.error('GET: ', error) }
  }

  /** --------------------- 🗑️ CLEANUP FUNCTIONS --------------------- **/


  /** --------------------- 🚀 INIT APP --------------------- **/

}

window.addEventListener("DOMContentLoaded", init)