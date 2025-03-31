"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="w-full flex items-center h-[70px] justify-between px-6 bg-white shadow-sm sticky top-0">
        <div className="flex items-center gap-x-4">
          <Link
            href="/account"
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#787486]" />
          </Link>
          <h2 className="text-xl font-bold text-[#0D062D]">
            Terms & Conditions
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8"
        >
          <div className="prose prose-slate max-w-none">
            <p className="text-[#787486]">
              {`These terms and conditions apply to the Use Alarm app (hereby referred to as "Application") for mobile devices that was created by Nowon Lee (hereby referred to as "Service Provider") as a Free service.`}
            </p>

            <p className="text-[#787486] mt-4">
              Upon downloading or utilizing the Application, you are
              automatically agreeing to the following terms. It is strongly
              advised that you thoroughly read and understand these terms prior
              to using the Application. Unauthorized copying, modification of
              the Application, any part of the Application, or our trademarks is
              strictly prohibited. Any attempts to extract the source code of
              the Application, translate the Application into other languages,
              or create derivative versions are not permitted. All trademarks,
              copyrights, database rights, and other intellectual property
              rights related to the Application remain the property of the
              Service Provider.
            </p>

            <p className="text-[#787486] mt-4">
              The Service Provider is dedicated to ensuring that the Application
              is as beneficial and efficient as possible. As such, they reserve
              the right to modify the Application or charge for their services
              at any time and for any reason. The Service Provider assures you
              that any charges for the Application or its services will be
              clearly communicated to you.
            </p>

            <p className="text-[#787486] mt-4">
              {`The Application stores and processes personal data that you have
              provided to the Service Provider in order to provide the Service.
              It is your responsibility to maintain the security of your phone
              and access to the Application. The Service Provider strongly
              advise against jailbreaking or rooting your phone, which involves
              removing software restrictions and limitations imposed by the
              official operating system of your device. Such actions could
              expose your phone to malware, viruses, malicious programs,
              compromise your phone's security features, and may result in the
              Application not functioning correctly or at all.`}
            </p>

            <h3 className="text-[#0D062D] font-semibold mt-8">
              Third Party Services
            </h3>
            <p className="text-[#787486]">
              Please note that the Application utilizes third-party services
              that have their own Terms and Conditions. Below are the links to
              the Terms and Conditions of the third-party service providers used
              by the Application:
            </p>
            <ul className="text-[#787486] list-disc pl-6">
              <li>
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5030E5] hover:text-[#4024B8] transition-colors"
                >
                  Google Play Services
                </a>
              </li>
              <li>
                <a
                  href="https://www.google.com/analytics/terms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5030E5] hover:text-[#4024B8] transition-colors"
                >
                  Google Analytics for Firebase
                </a>
              </li>
            </ul>

            <h3 className="text-[#0D062D] font-semibold mt-8">
              Internet Connection
            </h3>
            <p className="text-[#787486]">
              Please be aware that the Service Provider does not assume
              responsibility for certain aspects. Some functions of the
              Application require an active internet connection, which can be
              Wi-Fi or provided by your mobile network provider. The Service
              Provider cannot be held responsible if the Application does not
              function at full capacity due to lack of access to Wi-Fi or if you
              have exhausted your data allowance.
            </p>

            <p className="text-[#787486] mt-4">
              {`If you are using the application outside of a Wi-Fi area, please
              be aware that your mobile network provider's terms of agreement
              will still apply. As a result, you may be charged by your mobile
              provider for the cost of data for the duration of the connection
              while accessing the application, or other third-party charges. By
              using the application, you accept responsibility for any such
              charges, including roaming data charges if you use the application
              outside of your home territory (i.e., region or country) without
              disabling data roaming. If you are not the bill payer for the
              device on which you are using the application, they assume that
              you have obtained permission from the bill payer.`}
            </p>

            <h3 className="text-[#0D062D] font-semibold mt-8">
              Device Requirements
            </h3>
            <p className="text-[#787486]">
              Similarly, the Service Provider cannot always assume
              responsibility for your usage of the application. For instance, it
              is your responsibility to ensure that your device remains charged.
              If your device runs out of battery and you are unable to access
              the Service, the Service Provider cannot be held responsible.
            </p>

            <h3 className="text-[#0D062D] font-semibold mt-8">
              {`Service Provider's Responsibility`}
            </h3>
            <p className="text-[#787486]">
              {`In terms of the Service Provider's responsibility for your use of
              the application, it is important to note that while they strive to
              ensure that it is updated and accurate at all times, they do rely
              on third parties to provide information to them so that they can
              make it available to you. The Service Provider accepts no
              liability for any loss, direct or indirect, that you experience as
              a result of relying entirely on this functionality of the
              application.`}
            </p>

            <h3 className="text-[#0D062D] font-semibold mt-8">
              Updates and Termination
            </h3>
            <p className="text-[#787486]">
              The Service Provider may wish to update the application at some
              point. The application is currently available as per the
              requirements for the operating system (and for any additional
              systems they decide to extend the availability of the application
              to) may change, and you will need to download the updates if you
              want to continue using the application. The Service Provider does
              not guarantee that it will always update the application so that
              it is relevant to you and/or compatible with the particular
              operating system version installed on your device. However, you
              agree to always accept updates to the application when offered to
              you. The Service Provider may also wish to cease providing the
              application and may terminate its use at any time without
              providing termination notice to you. Unless they inform you
              otherwise, upon any termination, (a) the rights and licenses
              granted to you in these terms will end; (b) you must cease using
              the application, and (if necessary) delete it from your device.
            </p>

            <h3 className="text-[#0D062D] font-semibold mt-8">
              Changes to Terms and Conditions
            </h3>
            <p className="text-[#787486]">
              The Service Provider reserves the right to modify these terms and
              conditions at any time. Accordingly, you are advised to review
              this page regularly for any changes. The Service Provider will
              notify you of any changes by posting the new Terms and Conditions
              on this page.
            </p>

            <p className="text-[#787486] mt-4">
              These terms and conditions are effective as of 2025-03-31
            </p>

            <h3 className="text-[#0D062D] font-semibold mt-8">Contact Us</h3>
            <p className="text-[#787486]">
              If you have any questions or suggestions about the Terms and
              Conditions, please do not hesitate to contact the Service Provider
              at{" "}
              <a
                href="mailto:nw.lee@outlook.com"
                className="text-[#5030E5] hover:text-[#4024B8] transition-colors"
              >
                nw.lee@outlook.com
              </a>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export const runtime = "edge";
