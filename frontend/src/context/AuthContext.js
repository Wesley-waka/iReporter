import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// user login
const loginUser = (email, password) => {
  return fetch("/login", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.authorized) {
        const token = data.token;

        return { user: data.user, token: token };
      } else {
        throw new Error("Invalid email or password");
      }
    });
};
