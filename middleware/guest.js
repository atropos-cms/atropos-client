export default function ({ store, redirect }) {
  // // If the user is authenticated
  if (store.getters['profile/loggedIn']) return redirect('/')
}
