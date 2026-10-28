import { Component, useEffect } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { ErrorState } from "./ui";
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
}
export class ViewErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <ErrorState retry={() => this.setState({ failed: false })} />
    ) : (
      this.props.children
    );
  }
}
