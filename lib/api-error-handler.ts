import { NextResponse } from "next/server";
import { logger } from "./logger";

interface ErrorResponseOptions {
  status?: number;
  message?: string;
  error?: any;
  route?: string;
  method?: string;
}

/**
 * 統一的 API 錯誤處理函數
 * 確保所有 500 錯誤都被記錄到日誌文件
 */
export function handleApiError(
  error: any,
  options: ErrorResponseOptions = {}
): NextResponse {
  const {
    status = 500,
    message = "Internal server error",
    route = "unknown",
    method = "unknown",
  } = options;

  // 提取錯誤信息
  const errorMessage = error?.message || message;
  const errorCode = error?.code || "UNKNOWN";
  const errorStack = error?.stack;

  // 構建詳細的錯誤信息
  const errorDetails = {
    route,
    method,
    status,
    message: errorMessage,
    code: errorCode,
    timestamp: new Date().toISOString(),
    ...(errorStack && { stack: errorStack }),
  };

  // 如果是 500 錯誤，必須記錄到日誌
  if (status === 500) {
    logger.error(`[${method}] ${route} - 500 Error`, {
      ...errorDetails,
      originalError: error,
    });
  } else if (status >= 400) {
    // 其他錯誤也記錄，但級別較低
    logger.warn(`[${method}] ${route} - ${status} Error`, errorDetails);
  }

  // 開發環境返回詳細錯誤信息
  if (process.env.NODE_ENV === "development") {
    return NextResponse.json(
      {
        error: message,
        details: errorMessage,
        code: errorCode,
        ...(errorStack && { stack: errorStack }),
      },
      { status }
    );
  }

  // 生產環境返回簡化的錯誤信息
  return NextResponse.json(
    {
      error: message,
      ...(status === 500 ? {} : { code: errorCode }),
    },
    { status }
  );
}

/**
 * 包裝 API 路由處理函數，自動捕獲和記錄錯誤
 */
export function withErrorHandling(
  handler: (request: Request, context?: any) => Promise<NextResponse>,
  routeName: string
) {
  return async (request: Request, context?: any): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error: any) {
      return handleApiError(error, {
        route: routeName,
        method: request.method,
      });
    }
  };
}

