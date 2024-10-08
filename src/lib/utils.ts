import { clsx, type ClassValue } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'
import { ComparatorContent, CustomSearchResponse, NewsItem } from './types'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const nanoid = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    7
) // 7-character random string

export async function fetcher<JSON = any>(
    input: RequestInfo,
    init?: RequestInit
): Promise<JSON> {
    const res = await fetch(input, init)

    if (!res.ok) {
        const json = await res.json()
        if (json.error) {
            const error = new Error(json.error) as Error & {
                status: number
            }
            error.status = res.status
            throw error
        } else {
            throw new Error('An unexpected error occurred')
        }
    }

    return res.json()
}

export function formatDate(input: string | number | Date): string {
    const date = new Date(input)
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })
}

export const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value)

export const runAsyncFnWithoutBlocking = (
    fn: (...args: any) => Promise<any>
) => {
    fn()
}

export const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms))

export const getStringFromBuffer = (buffer: ArrayBuffer) =>
    Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

export enum ResultCode {
    InvalidCredentials = 'INVALID_CREDENTIALS',
    InvalidSubmission = 'INVALID_SUBMISSION',
    UserAlreadyExists = 'USER_ALREADY_EXISTS',
    UnknownError = 'UNKNOWN_ERROR',
    UserCreated = 'USER_CREATED',
    UserLoggedIn = 'USER_LOGGED_IN'
}

export const getMessageFromCode = (resultCode: string) => {
    switch (resultCode) {
        case ResultCode.InvalidCredentials:
            return 'Invalid credentials!'
        case ResultCode.InvalidSubmission:
            return 'Invalid submission, please try again!'
        case ResultCode.UserAlreadyExists:
            return 'User already exists, please log in!'
        case ResultCode.UserCreated:
            return 'User created, welcome!'
        case ResultCode.UnknownError:
            return 'Something went wrong, please try again!'
        case ResultCode.UserLoggedIn:
            return 'Logged in!'
    }
}

export function format(date: Date, formatString: string) {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ]

    return formatString
        .replace('yyyy', year.toString())
        .replace('yy', String(year).slice(-2))
        .replace('LLL', monthNames[month]!)
        .replace('MM', String(month + 1).padStart(2, '0'))
        .replace('dd', String(day).padStart(2, '0'))
        .replace('d', day.toString())
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds)
}

export function parseISO(dateString: string) {
    return new Date(dateString)
}

export function subMonths(date: Date, amount: number) {
    const newDate: Date = new Date(date)
    newDate.setMonth(newDate.getMonth() - amount)
    return newDate
}

export function parseComparatorContent(input: string): ComparatorContent[] {
    const candidatePattern = /Candidate:\s*(.*?)\nContent:\s*([\s\S]*?)(?=Candidate:|$)/g;
    const candidates: ComparatorContent[] = [];
  
    let match: RegExpExecArray | null;
    while ((match = candidatePattern.exec(input)) !== null) {
      const candidate = match[1]!.trim();
      const content = match[2]!.trim();
      candidates.push({ candidate, content });
    }
  
    return candidates;
  }




  export async function getNews(query: string): Promise<NewsItem[]> {
    const apiKey = process.env.GOOGLE_NEWS_API;
    const customSearchId = process.env.CUSTOM_NEWS_SEARCH_ID;
  
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${customSearchId}&q=${query}&sort=date&cr=countryLK`;
  
    try {
      const response = await fetch(url);
      const data: CustomSearchResponse = await response.json();
  
      if (data.items && data.items.length > 0) {
        const topItems = data.items.slice(0, 3);
  
        const newsItems: NewsItem[] = topItems.map(item => {
          const imageUrl = item.pagemap?.cse_image?.[0]?.src || "No image available";
  
          return {
            title: item.title,
            link: item.link,
            snippet: item.snippet,
            image: imageUrl
          };
        });
        
        return newsItems;
      } else {
        console.error("No results found.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      return [];
    }
  }