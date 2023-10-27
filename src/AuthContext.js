import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";

const token = localStorage.getItem("AccessToken");

async function getUserData() {
  try {
    const result = await axios.get(
      // "http://localhost:8080/api/members/profile"
      "http://3.37.43.105:8080/api/members/profile",
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    return {
      memberId: result.data.memberId,
      name: result.data.name,
      birthDate: result.data.birthDate,
      gender: result.data.gender,
      email: result.data.email,
    };
  } catch (error) {
    console.error("데이터를 가져오는 동안 오류 발생:", error);
  }
}

export const AuthContext = createContext({
  token: token,
  isLogin: token !== null ? true : false,
  userData:
    token !== null
      ? await getUserData()
      : {
          memberId: "",
          name: "",
          birthDate: "",
          gender: "",
          email: "",
        },
});

export function IsLoginProvider({ children }) {
  const [isLogin, setIsLogin] = useState(token !== null ? true : false);
  const [userData, setUserData] = useState({
    memberId: "",
    name: "",
    birthDate: "",
    gender: "",
    email: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        const data = await getUserData();
        setUserData(data);
      }
    };
    fetchData();
  }, []);

  // useMemo로 캐싱하지 않으면 value가 바뀔 때마다 state를 사용하는 모든 컴포넌트가 매번 리렌더링됨
  const value = useMemo(
    () => ({ isLogin, setIsLogin, userData, setUserData }),
    [isLogin, setIsLogin, userData, setUserData]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useIsLoginState() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Cannot find IsLoginProvider");
  }
  return context.isLogin;
}

export function useUserData() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Cannot find IsLoginProvider");
  }
  return context.userData;
}
