const key = `signature`;
export function getSignature(): string {
  return localStorage.getItem(key);
}

export function clearSignature(): void {
  storeSignature('');
}

export function storeSignature(signature): void {
  localStorage.setItem(key, signature);
}

export function logined(): boolean {
  return Boolean(getSignature());
}

export function storeUserInfo(data): void {
  localStorage.setItem('user-info', JSON.stringify(data));
}

export function clearUserInfo(): void {
  localStorage.setItem('user-info', '');
}

export function getUserInfo(): any {
  try {
    // tslint:disable-next-line:no-shadowed-variable
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    return userInfo;
  } catch (err) {
    return {};
  }
}
