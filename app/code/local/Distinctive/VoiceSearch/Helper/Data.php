<?php

class Distinctive_VoiceSearch_Helper_Data extends Mage_Core_Helper_Abstract
{
    const XML_PATH_VOICE_SEARCH_ENABLED = 'voice_search/general/active';

    /**
     * check if Voice Search feature is enabled
     *
     * @return bool
     * */
    public function isEnabled()
    {
        return (bool)Mage::getStoreConfig(self::XML_PATH_VOICE_SEARCH_ENABLED);
    }
}