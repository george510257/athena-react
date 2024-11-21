import { MockMethod } from 'vite-plugin-mock'

// 用户信息接口定义
interface UserInfo {
  id: number
  username: string
  password: string
  avatar: string
  role: string
}

// Token 映射接口
interface TokenMap {
  admin: string
  user: string
}

// 用户映射接口
interface UserMap {
  [key: string]: UserInfo
}

// 模拟的 token 数据
const tokens: TokenMap = {
  admin: 'admin-token',
  user: 'user-token'
}

// 模拟的用户数据
const users: UserMap = {
  'admin-token': {
    id: 1,
    username: 'admin',
    password: '123456',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    role: 'admin'
  },
  'user-token': {
    id: 2,
    username: 'user',
    password: '123456',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    role: 'user'
  }
}

// 请求体接口定义
interface RequestBody {
  username?: string
  password?: string
  loginType?: string
  phone?: string
  verifyCode?: string
}

export default [
  // 获取验证码接口
  {
    url: '/api/auth/captcha',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          captchaId: 'mock-captcha-id',
          captchaUrl: 'https://picsum.photos/100/40'
        }
      }
    }
  },
  
  // 登录接口 - 支持账号密码和手机号验证码两种方式
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: { body: RequestBody }) => {
      const { username, password, loginType, phone, verifyCode } = body

      // 账号密码登录
      if (loginType === 'account') {
        if (username === 'admin' && password === '123456') {
          return {
            code: 200,
            data: {
              token: tokens.admin,
              user: users[tokens.admin]
            }
          }
        }
        if (username === 'user' && password === '123456') {
          return {
            code: 200,
            data: {
              token: tokens.user,
              user: users[tokens.user]
            }
          }
        }
        return {
          code: 400,
          message: '用户名或密码错误'
        }
      }

      // 手机号验证码登录
      if (loginType === 'phone') {
        if (phone === '13800138000' && verifyCode === '123456') {
          return {
            code: 200,
            data: {
              token: tokens.user,
              user: users[tokens.user]
            }
          }
        }
        return {
          code: 400,
          message: '手机号或验证码错误'
        }
      }

      return {
        code: 400,
        message: '未知的登录类型'
      }
    }
  },

  // 发送验证码接口
  {
    url: '/api/auth/verify-code',
    method: 'post',
    response: ({ body }: { body: { phone: string } }) => {
      const { phone } = body
      if (phone === '13800138000') {
        return {
          code: 200,
          data: {
            message: '验证码发送成功'
          }
        }
      }
      return {
        code: 400,
        message: '验证码发送失败'
      }
    }
  },

  // 获取用户信息接口
  {
    url: '/api/user/info',
    method: 'get',
    response: ({ headers }: { headers: { authorization?: string } }) => {
      const token = headers.authorization?.replace('Bearer ', '')
      if (token && users[token]) {
        return {
          code: 200,
          data: users[token]
        }
      }
      return {
        code: 401,
        message: '未登录或 token 已过期'
      }
    }
  },

  // 获取仪表盘数据接口
  {
    url: '/api/dashboard/overview',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          stats: {
            totalUsers: 1234,
            activeUsers: 923,
            totalOrders: 6789,
            pendingOrders: 56,
            revenue: {
              daily: 12500,
              weekly: 85600,
              monthly: 358000,
              dailyGrowth: 15.5,
              weeklyGrowth: 8.2,
              monthlyGrowth: 12.3,
            }
          },
          activities: [
            {
              id: 1,
              type: 'order',
              content: '新订单 #12345 已创建',
              timestamp: '2024-01-20T10:30:00Z'
            },
            {
              id: 2,
              type: 'user',
              content: '新用户注册: Zhang San',
              timestamp: '2024-01-20T09:15:00Z'
            },
            {
              id: 3,
              type: 'system',
              content: '系统更新完成',
              timestamp: '2024-01-20T08:00:00Z'
            }
          ]
        }
      }
    }
  }
] as MockMethod[] 