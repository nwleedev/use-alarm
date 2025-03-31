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
          <h2 className="text-xl font-bold text-[#0D062D]">Privacy Policy</h2>
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
              {`This privacy policy applies to the Use Alarm app (hereby referred
              to as "Application") for mobile devices that was created by Nowon
              Lee (hereby referred to as "Service Provider") as a Free service.
              This service is intended for use "AS IS".`}
            </p>

            <h3 className="text-[#0D062D] font-semibold mt-8">
              Information Collection and Use
            </h3>
            <p className="text-[#787486]">
              The Application collects information when you download and use it.
              This information may include information such as:
            </p>
            <ul className="text-[#787486] list-disc pl-6">
              <li>{`Your device's Internet Protocol address (e.g. IP address)`}</li>
              <li>
                The pages of the Application that you visit, the time and date
                of your visit, the time spent on those pages
              </li>
              <li>The time spent on the Application</li>
              <li>The operating system you use on your mobile device</li>
            </ul>

            <p className="text-[#787486] mt-4">
              The Application does not gather precise information about the
              location of your mobile device.
            </p>

            <p className="text-[#787486] mt-4">
              The Service Provider may use the information you provided to
              contact you from time to time to provide you with important
              information, required notices and marketing promotions.
            </p>

            <p className="text-[#787486] mt-4">
              For a better experience, while using the Application, the Service
              Provider may require you to provide us with certain personally
              identifiable information, including but not limited to Email,
              Username. The information that the Service Provider request will
              be retained by them and used as described in this privacy policy.
            </p>

            <h3 className="text-[#0D062D] font-semibold mt-8">
              Third Party Access
            </h3>
            <p className="text-[#787486]">
              Only aggregated, anonymized data is periodically transmitted to
              external services to aid the Service Provider in improving the
              Application and their service. The Service Provider may share your
              information with third parties in the ways that are described in
              this privacy statement.
            </p>

            <p className="text-[#787486] mt-4">
              Please note that the Application utilizes third-party services
              that have their own Privacy Policy about handling data. Below are
              the links to the Privacy Policy of the third-party service
              providers used by the Application:
            </p>
            <ul className="text-[#787486] list-disc pl-6">
              <li>
                <a
                  href="https://www.google.com/policies/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5030E5] hover:text-[#4024B8] transition-colors"
                >
                  Google Play Services
                </a>
              </li>
              <li>
                <a
                  href="https://firebase.google.com/support/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5030E5] hover:text-[#4024B8] transition-colors"
                >
                  Google Analytics for Firebase
                </a>
              </li>
            </ul>

            <h3 className="text-[#0D062D] font-semibold mt-8">
              Opt-Out Rights
            </h3>
            <p className="text-[#787486]">
              You can stop all collection of information by the Application
              easily by uninstalling it. You may use the standard uninstall
              processes as may be available as part of your mobile device or via
              the mobile application marketplace or network.
            </p>

            <h3 className="text-[#0D062D] font-semibold mt-8">
              Data Retention Policy
            </h3>
            <p className="text-[#787486]">
              {`The Service Provider will retain User Provided data for as long as
              you use the Application and for a reasonable time thereafter. If
              you'd like them to delete User Provided Data that you have
              provided via the Application, please contact them at `}
              <a
                href="mailto:nw.lee@outlook.com"
                className="text-[#5030E5] hover:text-[#4024B8] transition-colors"
              >
                nw.lee@outlook.com
              </a>{" "}
              and they will respond in a reasonable time.
            </p>

            <h3 className="text-[#0D062D] font-semibold mt-8">Children</h3>
            <p className="text-[#787486]">
              The Service Provider does not use the Application to knowingly
              solicit data from or market to children under the age of 13.
            </p>

            <p className="text-[#787486] mt-4">
              The Application does not address anyone under the age of 13. The
              Service Provider does not knowingly collect personally
              identifiable information from children under 13 years of age. In
              the case the Service Provider discover that a child under 13 has
              provided personal information, the Service Provider will
              immediately delete this from their servers. If you are a parent or
              guardian and you are aware that your child has provided us with
              personal information, please contact the Service Provider (
              <a
                href="mailto:nw.lee@outlook.com"
                className="text-[#5030E5] hover:text-[#4024B8] transition-colors"
              >
                nw.lee@outlook.com
              </a>
              ) so that they will be able to take the necessary actions.
            </p>

            <h3 className="text-[#0D062D] font-semibold mt-8">Security</h3>
            <p className="text-[#787486]">
              The Service Provider is concerned about safeguarding the
              confidentiality of your information. The Service Provider provides
              physical, electronic, and procedural safeguards to protect
              information the Service Provider processes and maintains.
            </p>

            <h3 className="text-[#0D062D] font-semibold mt-8">Changes</h3>
            <p className="text-[#787486]">
              This Privacy Policy may be updated from time to time for any
              reason. The Service Provider will notify you of any changes to the
              Privacy Policy by updating this page with the new Privacy Policy.
              You are advised to consult this Privacy Policy regularly for any
              changes, as continued use is deemed approval of all changes.
            </p>

            <p className="text-[#787486] mt-4">
              This privacy policy is effective as of 2025-03-31
            </p>

            <h3 className="text-[#0D062D] font-semibold mt-8">Your Consent</h3>
            <p className="text-[#787486]">
              By using the Application, you are consenting to the processing of
              your information as set forth in this Privacy Policy now and as
              amended by us.
            </p>

            <h3 className="text-[#0D062D] font-semibold mt-8">Contact Us</h3>
            <p className="text-[#787486]">
              If you have any questions regarding privacy while using the
              Application, or have questions about the practices, please contact
              the Service Provider via email at{" "}
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
