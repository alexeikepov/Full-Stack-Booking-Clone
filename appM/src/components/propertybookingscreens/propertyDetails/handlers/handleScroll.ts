export function handleScroll(event: any, setIsScrolled: (v: boolean) => void) {
  const offsetY = event.nativeEvent.contentOffset.y;
  setIsScrolled(offsetY > 60);
}
