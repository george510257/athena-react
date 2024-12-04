interface LoginParams {
  username: string;
  password: string;
  imageCaptcha: string;
  uuid: string;
}

interface LoginResult {
  success: boolean;
  message?: string;
  token?: string;
}

export const login = async (params: LoginParams): Promise<LoginResult> => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: '网络请求失败',
    };
  }
}; 