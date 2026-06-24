 
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

import { auth, db } from "../firebase/config.js"





window.currentUser = null

export async function logout() {
    await signOut(auth)
}

export function initSession(callback) {

    onAuthStateChanged(auth, async (user) => {

        if (user) {

            const snap = await getDoc(doc(db, "users", user.uid))

            window.currentUser = {
                uid: user.uid,
                email: user.email,
                ...(snap.exists() ? snap.data() : {})
            }

            localStorage.setItem("user", JSON.stringify(window.currentUser))

        } else {

            window.currentUser = null
            localStorage.removeItem("user")
        }

        if (callback) callback(window.currentUser)
    })
}

export function getUser() {
    return window.currentUser || JSON.parse(localStorage.getItem("user"))
}