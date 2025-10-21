"use client";
import CreditProgressBar from "@/app/components/billing/CreditProgressBar";
import PaymentHistory from "@/app/components/billing/PaymentHistory";
import PaymentModal from "@/app/components/billing/PaymentModal";
import Modal from "@/app/components/Modal";
import useUser from "@/app/hooks/getUser";
import { useState } from "react";
import { BiPurchaseTag } from "react-icons/bi";

const Billing = () => {
  const [showModal, setShowModal] = useState(false);
  const [user] = useUser();
  const [refreshHistory, setrefreshHistory] = useState(0);

  if (!user?.id) return null;

  return (
    <div className="w-full flex flex-col h-screen py-8">
      <div className="w-[90%] mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground font-lato font-semibold text-xl">
            Credit Stats
          </h3>

          <button
            className="base-button flex space-x-1"
            onClick={() => setShowModal(true)}
          >
            <BiPurchaseTag className="text-lg" /> <span>Buy More Credits</span>
          </button>

          {/* payment modal */}
          <Modal
            open={showModal}
            title="Buy More Credits"
            onClose={() => setShowModal(false)}
          >
            <PaymentModal
              onClose={() => setShowModal(false)}
              setrefreshHistory={setrefreshHistory}
            />
          </Modal>
        </div>

        <div className="mt-4 w-full rounded-3xl flex flex-col items-center justify-center bg-white shadow-md p-5">
          <h1 className="text-2xl font-lato font-semibold text-foreground mb-1.5">
            {user?.numOfCredits || 0}
          </h1>

          <p className="text-foreground-secondary text-sm">Credits Available</p>

          <div className="mt-6 w-full">
            <CreditProgressBar
              totalCredits={user.totalCredits || 0}
              totalUsed={user.totalCredits - user.numOfCredits || 0}
            />
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-foreground font-lato font-semibold text-xl">
            Payments History
          </h3>
        </div>

        <div className="mt-4 w-full rounded-3xl flex flex-col items-center justify-center bg-white shadow-md p-2">
          <PaymentHistory />
        </div>
      </div>
    </div>
  );
};

export default Billing;
