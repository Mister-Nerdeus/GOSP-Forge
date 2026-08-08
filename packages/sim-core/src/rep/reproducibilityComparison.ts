export type RepEnvironmentReportLike = {
  environmentId: string;
  recordPath: string;
  expectedMaterialInputHash?: string;
  expectedMaterialResultHash?: string;
  materialInputHash: string;
  materialResultHash: string;
  inputHashMatches: boolean;
  resultHashMatches: boolean;
  environment: {
    os: string;
    architecture: string;
    runtime: string;
    locale?: string;
    timezone?: string;
    workingDirectory?: string;
  };
};

const executionPlatformFingerprint = (report: RepEnvironmentReportLike) => ({
  os: report.environment.os,
  architecture: report.environment.architecture,
  runtime: report.environment.runtime,
});

export function compareRepEnvironmentReports(
  environmentA: RepEnvironmentReportLike,
  environmentB: RepEnvironmentReportLike,
) {
  const fingerprintA = executionPlatformFingerprint(environmentA);
  const fingerprintB = executionPlatformFingerprint(environmentB);
  const checks = {
    distinctEnvironmentIds: environmentA.environmentId !== environmentB.environmentId,
    distinctEnvironmentEvidence: Object.keys(fingerprintA).some(
      (key) =>
        fingerprintA[key as keyof typeof fingerprintA] !==
        fingerprintB[key as keyof typeof fingerprintB],
    ),
    recordPathMatches: environmentA.recordPath === environmentB.recordPath,
    expectedInputHashMatches:
      environmentA.expectedMaterialInputHash === environmentB.expectedMaterialInputHash,
    expectedResultHashMatches:
      environmentA.expectedMaterialResultHash === environmentB.expectedMaterialResultHash,
    materialInputHashMatches: environmentA.materialInputHash === environmentB.materialInputHash,
    materialResultHashMatches: environmentA.materialResultHash === environmentB.materialResultHash,
    environmentAReplayPassed:
      environmentA.inputHashMatches === true && environmentA.resultHashMatches === true,
    environmentBReplayPassed:
      environmentB.inputHashMatches === true && environmentB.resultHashMatches === true,
  };
  return { checks, reproducible: Object.values(checks).every(Boolean) };
}
