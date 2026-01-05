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
            loading={loading}
            upgradeDialogOpen={upgradeDialogOpen}
            setUpgradeDialogOpen={setUpgradeDialogOpen}
            isFormValid={isFormValid}
            onSubmit={handleSubmit}
        />
    );
}
