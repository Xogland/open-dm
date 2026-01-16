"use client";

import { useCreateOrg } from "../hooks/use-create-org";
import { CreateOrgForm } from "./create-org-form";

export default function CreateOrganisationPage() {
    const {
        organisationName,
        setOrganisationName,
        handle,
        setHandle,
        setHandleStatus,
        redemptionKey,
        setRedemptionKey,
        category,
        setCategory,
        businessType,
        setBusinessType,
        loading,
        upgradeDialogOpen,
        setUpgradeDialogOpen,
        isFormValid,
        handleSubmit,
    } = useCreateOrg();

    return (
        <CreateOrgForm
            organisationName={organisationName}
            setOrganisationName={setOrganisationName}
            handle={handle}
            setHandle={setHandle}
            setHandleStatus={setHandleStatus}
            redemptionKey={redemptionKey}
            setRedemptionKey={setRedemptionKey}
            category={category}
            setCategory={setCategory}
            businessType={businessType}
            setBusinessType={setBusinessType}
            loading={loading}
            upgradeDialogOpen={upgradeDialogOpen}
            setUpgradeDialogOpen={setUpgradeDialogOpen}
            isFormValid={isFormValid}
            onSubmit={handleSubmit}
        />
    );
}
