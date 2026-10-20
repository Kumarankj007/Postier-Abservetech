import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const guest_routes = ['/account/register/', '/', '/account/login/', '/cancelationPolicy/', '/account/signup/', '/account/sendotp/', '/details/', '/account/resetpassword/', '/search/', '/cms/terms_condition/', '/cms/contact_us/', '/cms/privacy_policy/','/deliveryDetails/','/senderDetails', "/dynamicCalculation/" ,'/firebase-messaging-sw.js','/cms/help_center/', '/cms/dispute_resolution/', '/cms/payments_payouts/', '/cms/imprint/','/cms/help_center/publish_Your_Trip/', '/cms/help_center/sending_parcel/','/cms/help_center/offer_a_price/', '/cms/help_center/tracking_parcel/','/cms/help_center/why_stripe/', "/cms/help_center/recommended_photo/", "/cms/help_center/qr_pick_delivery/", "/cms/help_center/price_estimate/", "/cms/help_center/odr/", "/cms/help_center/photo_tips/",'/cms/about_us/','/videos/merlinjoli.mp4', '/deliveryCancellation/',];

const token_no_accept = ['/account/register/', '/account/login/', '/account/signup/', '/account/sendotp/', '/account/resetpassword/'];

const user_block = ['/createtrip/', '/mytrips/', '/accountsettings/manage-vehicles/']

export async function middleware(request: NextRequest) {
  // console.log(
  //   `=======MIDDLEWARE RUNNING FOR '${request.url}'===================`
  // );

  const pathname = request.nextUrl.pathname;
  // console.log('url_pathnames', pathname);
  if (pathname.startsWith('/_next') ||
    pathname.endsWith('.png') || //png extension
    pathname.startsWith('/details/') || //because it is dynamic page
    pathname.startsWith('/svg') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/png') || 
    pathname.startsWith('/webadmin')){
    return NextResponse.next()
  }
  const User_id: any = cookies().get('appUserId')
  const token: any = cookies().get('appToken')
  const RoleSwitch: any = cookies().get('RoleSwitch')
  const captchaSolved = cookies().get("captcha")?.value;
  const requestUrl = new URL(request.url);
  // when token not exists and url not ends with /account/register/
  if (!request.cookies.has('appToken') && !guest_routes.includes(pathname)) {
    // console.log('pathname', pathname)

    return NextResponse.redirect(requestUrl.origin + '/account/register')
  }
  
  //when token found or url contains in array
  else if (request.cookies.has('appToken') && token_no_accept.includes(pathname)) {
    // console.log('pathname2', pathname)
    if (requestUrl.origin)
      return NextResponse.redirect(requestUrl.origin)
  }
  if (RoleSwitch?.value === 'user' && user_block.includes(pathname)) {
    // console.log('pathnameddddddddddddd', pathname)
    return NextResponse.redirect(requestUrl.origin)
  }
  if (request.nextUrl.pathname.startsWith("/trackingpage/trackingstepper") && captchaSolved != "true") {
    return NextResponse.redirect(requestUrl.origin + '/trackingpage/');
  }
  if (User_id?.value && token?.value) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/common/user/profile/${User_id?.value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token?.value}`,
          },
          cache: "no-store",
          // next: { revalidate: 0 }, // Disable caching for fresh data
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      const data = await response.json();
      // console.log('emailVerified', data?.data?.profile?.emailVerified)
      // console.log('phoneVerified', data?.data?.profile?.phoneVerified)
      if ((!data?.data?.profile?.emailVerified || !data?.data?.profile?.phoneVerified)) {
        // console.log('iam innn4', pathname)
        if (pathname !== '/accountsettings/profileDetails/') {
          // return NextResponse.redirect(new URL('/accountsettings/profileDetails?type=auth', request.url));
        }
      }
    } catch {
      const response = NextResponse.next();
      response.cookies.set('appToken', '', {
        expires: new Date(0),
      });
      response.cookies.set('appUserId', '', {
        expires: new Date(0),
      });
    }




  }

  //when token found or url ends with account/register/
  return NextResponse.next()
}