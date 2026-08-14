import { NextResponse } from "next/server";
import { ErrorResponse, SuccessResponse } from "@/types/API";

export function success<T>(response: SuccessResponse<T>) {
  return NextResponse.json(
    { ...response, success: true },
    {
      status: 200,
    },
  );
}

export function created<T>(response: SuccessResponse<T>) {
  return NextResponse.json(
    { ...response, success: true },
    {
      status: 201,
    },
  );
}

export function badRequest(response: ErrorResponse) {
  return NextResponse.json(
    { ...response, success: false },
    {
      status: 400,
    },
  );
}

export function notFound(response: ErrorResponse) {
  return NextResponse.json(
    { ...response, success: false },
    {
      status: 404,
    },
  );
}

export function serverError(response: ErrorResponse) {
  return NextResponse.json(
    { ...response, success: false },
    {
      status: 500,
    },
  );
}
