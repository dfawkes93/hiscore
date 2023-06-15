import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    console.error(error.error);
    return <div>{error.error?.message}</div>;
  }
  return <div>"Oopsy we did a [REDACTED], please raise an issue on GitHub</div>
}
